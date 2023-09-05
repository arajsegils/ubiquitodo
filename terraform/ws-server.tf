provider "aws" {
  region = "eu-north-1"
}

resource "aws_security_group" "y_websocket_sg" {
  name        = "y-websocket-sg"
  description = "y-websocket security group"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 1234
    to_port     = 1234
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "y_websocket" {
  ami           = "ami-0989fb15ce71ba39e" # Update this if needed
  instance_type = "t3.micro"

  security_groups = [aws_security_group.y_websocket_sg.name]

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
              sudo apt-get install -y nodejs git
              npm install -g y-websocket
              HOST=0.0.0.0 PORT=1234 npx y-websocket &
              EOF

  tags = {
    Name = "y-websocket-server"
  }
  depends_on = [aws_lb_target_group_attachment.y_websocket_tg_attach]
}

resource "aws_lb_target_group_attachment" "y_websocket_tg_attach" {
  target_group_arn = "arn:aws:elasticloadbalancing:eu-north-1:921133869670:targetgroup/WS-1234/b251f58aeb5fcb1a"
  target_id        = aws_instance.y_websocket.id
  port             = 1234
}

output "instance_ip" {
  value = aws_instance.y_websocket.public_ip
}