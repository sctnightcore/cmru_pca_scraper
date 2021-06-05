
## Member.json
### คือ ข้อมูลผู้ลงแข่งขันทั้งหมด

```
  {
    "id": "B1",
    "full_name": "",
    "nick_name": "",
    "branch": "",
    "url": "https://m.facebook.com/photo.php?fbid=674647389904363",
    "all_point": 1,
    "all_like": 229,
    "all_share": 97
  }

```
id = รหัสผู้เข้าแข่ง

full_name = ชื่อเต็ม

nick_name = ชื่อเล่น

branch = สาขา

url = ลิ้งหน้าโหวต

all_point = คะแนนรวม

all_like = คะแนนรวม ไลค์

all_share = คะแนนรวม แชร์


## History.json
### คือ ข้อมูล การ Like / Share ทุกวัน แยกเป็น เวลา กับ วัน

```
{
  "start_date": "",
  "end_data": "",
  "update_time": "",
  "point_data": [],
  "like_data": [],
  "share_data": []
}

```

start_end = วันเริ่มการแข่ง

end_date = วันจบการแข่งขัน

update_time = อัพเดพล่าสุด

point_data = เก็บข้อมูลเป็น object 

like_data = เก็บข้อมูลเป็น object

share_data = เก็บข้อมูลเป็น object