const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.hanoicomputer.vn/');

    const cates = await page.evaluate(()=>{
      let a = document.querySelectorAll('.homepage-slider-left > ul > li > a');
      let links =[];
      a.forEach((element,index) => {
          let main_cate = element.getAttribute('href')
          // .replace(/\//,'').replace(/\-/g,' ');
          links.push({
              // 'id': index+1,
              'parent_id': 0,
              'name': main_cate
          });
          goto
      });
      return links;
  })
  // let res ="[\n";
  // cates.forEach(element => {
  //     res=res+"\t[\n\t\t";
  //     res=res+"'id' => "+ element.id +",\n\t\t";
  //     res=res+"'parent_id' => "+ element.parent_id +",\n\t\t";
  //     res=res+"'name' => '"+ element.name +"',\n\t\t";
  //     res=res+"'slug' => Str::slug('" + element.name +"'),\n\t\t";
  //     res=res+"'created_at' => new DateTime(),\n\t\t";
  //     res=res+"'updated_at' => new DateTime()";
  //     res=res+"\n\t],\n";
  // });
  // res=res+"]";
  // await fs.writeFile('output.txt',res,function(err){
  //     if(err) throw err;
  //     console.log('done!');
  // })
  console.log(cates);
    await browser.close();
})();
