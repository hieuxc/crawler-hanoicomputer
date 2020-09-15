const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.hanoicomputer.vn/laptop-lg-gram-15zd90n-v-ax56a5-i5-1035g7-8gb-ram-512gb-ssd-15-6-inch-fhd-fp-xam-bac-model-2020");

    const spec = await page.evaluate(() => {
        let res = [];
        let tr = document.querySelectorAll('.bang-tskt')[0].querySelectorAll('table > tbody > tr');
        for(let i=1;i<=25;i++){
            res.push(tr[i].querySelectorAll('td')[0].querySelector('p').innerHTML);
        }
        return res;
    });
    
    let res ="[\n";
    spec.forEach(element => {
        res=res+"\t[\n\t\t";
        res=res+"'product_type_id' => "+ 1 +",\n\t\t";
        res=res+"'name' => '"+ element +"',\n\t\t";
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
