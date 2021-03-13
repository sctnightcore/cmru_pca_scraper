
## membersData.json
### คือ ข้อมูลผู้ลงแข่งขันทั้งหมด

```
  {
    "id": "",
    "name": "",
    "nick_name": "",
    "class": "",
    "url": "",
    "point": "",
    "like": "",
    "diff_like": 0,
    "diff_like_status": "",
    "share": "",
    "diff_share": 0,
    "diff_like_share": ""
  }
```

id = รหัสผู้เข้าแข่ง

name = ชื่อ

nick_name = ชื่อเล่น

class = สาขา

url = ลิ้งแชร์ ต้องเป็น m.facebook เท่านั้น

point = คะแนนรวม จาก like + share

like = จำนวน Like

diff_like = Like เพิ่มขึ้นจำนวนเท่าไหร่ จากการเช็กครั้งที่แล้ว

diff_like_status = สถานะ ของ diff_like [ same = เท่าเดิม , up = เพิ่มขึ้น, down = ลดลง]

share = จำนวน share

diff_share = Share เพิ่มขึ้นจำนวนเท่าไหร่ จากการเช็กครั้งที่แล้ว

diff_like_share = สถานะ ของ diff_share [ same = เท่าเดิม , up = เพิ่มขึ้น, down = ลดลง]



## HistoryData.json
### คือ ข้อมูล การ Like / Share ทุกวัน แยกเป็น เวลา กับ วัน
