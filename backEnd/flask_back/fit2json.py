import io
import os
import requests
import json
import tempfile
import time
import fitparse
from datetime import datetime, timedelta
class DateTimeEncoder(json.encoder.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        return super(DateTimeEncoder, self).default(o)
 
def parse_fit_file_from_url(url):
    # 从 URL 下载 `.fit` 文件并将其保存到临时文件中
    # response = requests.get(url)
    # content_file = io.BytesIO(response.content)
    # temp_file = tempfile.NamedTemporaryFile(delete=False)
    # temp_file.write(content_file.getvalue())
    # temp_file.close()
 
    # 解析 `.fit` 文件并提取数据
    # fitfile = fitparse.FitFile(temp_file.name)
    fitfile = fitparse.FitFile(url)
    lap_data = []
    message_data = []
    
    for record in fitfile.get_messages('record'):
        # 从每个记录帧中提取数据并转换为字典
        message = {}
        for data in record:
            name = data.name
            value = data.value
            
            # 如果值为 bytes 类型，则将其转换为字符串类型
            if isinstance(value, str):
                value = value.decode('utf-8')
                value = value.split('\x00')[0] or None
            
            message[name] = value
        
        message_data.append(message)
 
    # 删除临时文件
    # os.unlink(temp_file.name)
 
    # 将提取的数据转换为 JSON 格式并返回
    result_json = json.dumps(message_data,indent=4, cls=DateTimeEncoder)
    return result_json
 
# 设置要下载和解析的 `.fit` 文件地址




def time_handler(target_time: str):
    """
    UTC世界标准时间（包含T和Z） 转 北京时间
    :param target_time:
    :return:
    """
    _date = datetime.strptime(target_time, "%Y-%m-%dT%H:%M:%SZ")
    local_time = _date + timedelta(hours=8)
    end_time = local_time.strftime("%Y-%m-%dT%H:%M:%SZ")
    return end_time


def save_gpx(gpx, path):
    try:
        f = open(path, 'w', encoding="utf-8")
    except:
        f = open(path, 'a', encoding="utf-8")
    for i in gpx:
        f.write(i)
    f.close()


def change_time(gpx):
    gpx_list = []
    s = ''
    for i in range(len(gpx)):
        s = gpx[i]
        try:
            ti = str((gpx[i].split("<time>")[1]).split("</time>")[0])
            print(type(ti))
            change_time = time_handler(ti)
            print(change_time)
            s = str(gpx[i].replace(ti, str(change_time)))
        except:
            pass
        gpx_list.append(s)
    return gpx_list



if __name__ == '__main__':
    # start_time = "2024-02-07T16:00:00.000Z"
    # time_str = time_handler(start_time)
    # print(time_str)

    #
    # # 2024-02-08 00:00:00
    # path = "./2024-07-19 1137--两步记录.gpx"
    #
    # f = open(path, 'r', encoding="utf-8")
    # gpx_lines = f.readlines()
    # gpx_list = change_time(gpx_lines)
    # f.close()
    # save_gpx(gpx_list, "./test2.gpx")

    url = "0717.fit"

    # 调用解析 `.fit` 文件的函数，将结果作为 JSON 返回
    result_json = parse_fit_file_from_url(url)
    with open('data_wechat.json', 'w', encoding='utf-8') as f:
        json.dump(result_json, f, indent=4)

# 输出 JSON 格式的解析结果
# print(result_json)