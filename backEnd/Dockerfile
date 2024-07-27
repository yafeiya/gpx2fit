# 使用 Python 官方镜像
FROM python:3.9-slim

# 设置工作目录
COPY . /app
WORKDIR /app


#requirements.txt 并安装依赖
COPY requirements.txt requirements.txt
RUN pip config set global.index-url http://mirrors.cloud.tencent.com/pypi/simple \
&& pip config set global.trusted-host mirrors.cloud.tencent.com \
&& pip install --upgrade pip \
&& pip install --user -r requirements.txt

EXPOSE 8080
CMD ["python3", "main.py", "0.0.0.0", "8080"]
