const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://www.hanoicomputer.vn/ajax/render_html.php?tpl=';
const tpl = 'html/menu_cat_455';
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url+tpl);

    const cates = await page.evaluate(()=>{
        let li = document.querySelectorAll('.position-relative > a');
        let links =[];
        let i=69;
        // for(let h =0;h<3;h++){
        //     // let a = li[h].querySelector('a');
        //     // let cate = a.innerHTML;
        //     links.push({
        //         'id': i,
        //         'parent_id': 63,
        //         'name': li[h].innerHTML
        //     });
        //     i++;
        // };
        for(let h =0;h<6;h++){
            let a = li[h].querySelectorAll('.position-relative > a');
            for(let k=0;k<3&&k<a.length;k++){
                links.push({
                    'id': i,
                    'parent_id': h+63,
                    'name': a[k].innerHTML
                });
                i++;
            };
        };
        return links;
    })
    let res ="[\n";
    cates.forEach(element => {
        res=res+"\t[\n\t\t";
        res=res+"'id' =>"+ element.id +",\n\t\t";
        res=res+"'parent_id' =>"+ element.parent_id +",\n\t\t";
        res=res+"'name' => '"+ element.name +"',\n\t\t";
        res=res+"'slug' => Str::slug('" + element.name +"'),\n\t\t";
        res=res+"'created_at' => new DateTime(),\n\t\t";
        res=res+"'updated_at' => new DateTime()";
        res=res+"\n\t],\n";
    });
    res=res+"]";
    await fs.writeFile('output.txt',res,function(err){
        if(err) throw err;
        console.log('done!');
    })
    await browser.close();
})();