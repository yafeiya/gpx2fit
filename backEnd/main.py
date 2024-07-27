import os.path
import mimetypes
from flask import Flask, request, redirect, flash, send_file,make_response,send_from_directory
# from itsdangerous import json
from flask_back.gpx2fit import gpx2fit

import sys
app = Flask(__name__)# 声明app
app.secret_key = os.urandom(16)#设置session的密钥
UPLOAD_FOLDER = './uploads'#上传文件的路径
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)
    if file:
        filename = file.filename
        # 判断文件名后缀是否为gpx
        if filename.split('.')[-1] == 'gpx':
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            fit_path = gpx2fit(filepath)  
            print("gpx converter success in :", fit_path)
            return f'File {filename} convert successfully'
        # 判断文件是图片
        elif filename.split('.')[-1] in ['jpg', 'jpeg', 'png', 'bmp']:
            return 'File is not gpx'

@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory('download', filename, as_attachment=True)

# 启动Flask Web服务
if __name__ == '__main__':
    app.run(host=sys.argv[1], port=sys.argv[2])