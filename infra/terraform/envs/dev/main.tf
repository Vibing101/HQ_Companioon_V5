locals {
  tags = {
    Project     = "HQ_CompanionApp"
    Environment = "dev"
  }
  hostname = "HQv2.${var.cf_zone_name}"
}

# ── AMI: Ubuntu 24.04 LTS (Canonical) ────────────────────────────────────────

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

data "aws_vpc" "default" {
  default = true
}

# ── SSH Key Pair ──────────────────────────────────────────────────────────────

resource "aws_key_pair" "admin" {
  key_name   = "hq-dev-admin"
  public_key = var.ssh_public_key
  tags       = local.tags
}

# ── Security Group: SSH only ──────────────────────────────────────────────────
# No port 80/443/4000 — cloudflared creates an outbound-only tunnel.

resource "aws_security_group" "dev" {
  name        = "hq-dev-sg"
  description = "SSH from admin only; all egress. Web traffic via Cloudflare Tunnel (outbound)."
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "SSH from admin"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.tags
}

# ── IAM: SSM access (optional but handy for browser-based shell) ──────────────

resource "aws_iam_role" "ec2_ssm_role" {
  name = "hq-dev-ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_instance_profile" "ec2_ssm" {
  name = "hq-dev-ec2-ssm-profile"
  role = aws_iam_role.ec2_ssm_role.name
}

resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ── EC2 Instance ──────────────────────────────────────────────────────────────

resource "aws_instance" "dev" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.admin.key_name

  vpc_security_group_ids      = [aws_security_group.dev.id]
  associate_public_ip_address = true
  iam_instance_profile        = aws_iam_instance_profile.ec2_ssm.name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  # user_data bootstraps the full stack on first boot.
  # Loaded from user_data.sh via templatefile() to avoid nested heredoc issues.
  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo  = var.github_repo
    hostname     = local.hostname
    tunnel_token = cloudflare_tunnel.hq.tunnel_token
  })

  # Tunnel token is known only after cloudflare_tunnel is created,
  # so Terraform will create the tunnel before this instance.
  depends_on = [cloudflare_tunnel.hq]

  tags = merge(local.tags, {
    Name = "hq-dev"
  })
}

# ── Elastic IP (stable address for SSH; tunnel doesn't need a static IP) ─────

resource "aws_eip" "dev" {
  instance = aws_instance.dev.id
  domain   = "vpc"

  tags = merge(local.tags, {
    Name = "hq-dev-eip"
  })
}
