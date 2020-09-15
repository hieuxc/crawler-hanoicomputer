const fs = require('fs');
let cates = [
    'laptop máy tính xách tay',
    'máy tính chơi game',
    'máy chủ workstations',
    'máy tính văn phòng',
    'thiết bị văn phòng',
    'linh kiện máy tính',
    'màn hình máy tính',
    'phím chuột gaming gear',
    'tản nhiệt cooling',
    'tivi điện lạnh',
    'camera thiết bị an ninh',
    'thiết bị nghe nhìn',
    'thiết bị siêu thị cửa hàng',
    'tb hội nghị trường học',
    'thiết bị thông mình',
    'thiết bị lưu trữ',
    'thiết bị mang',
    'phụ kiện'
];
let res ="[\n";

cates.forEach(element => {
    res=res+"\t[\n\t\t";
    res=res+"'parent_id' => 0,\n\t\t";
    res=res+"'name' => '"+ element +"',\n\t\t";
    res=res+"'slug' => Str::slug('" + element +"'),\n\t\t";
    res=res+"'created_at' => new DateTime(),\n\t\t";
    res=res+"'updated_at' => new DateTime()";
    res=res+"\n\t],\n";
});
res=res+"]";
fs.writeFile('output.txt',res,function(err){
    if(err) throw err;
    console.log('done!');
})