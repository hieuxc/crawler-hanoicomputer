const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.hanoicomputer.vn/laptop-asus-vivobook");

    const pro_urls = await page.evaluate(() => {
        let a = document.querySelectorAll(".p-img > a");
        let url = Array.from(a).map(u=>u.href);
        return url;
    });
    // let pro_urls = ['https://www.hanoicomputer.vn/laptop-asus-x509ja-ej021t-i5-1035g1-4g-512gb-ssd-15-6-full-hd-fp-win-10-bac'];
    let infos = [];
    for (let pro_url of pro_urls) {
        await page.goto(pro_url);
        const pro = await page.evaluate(async(pro_url) => {
            let info = {};
            info["admin_id"] = 1;
            info["category_id"] = 29;
            info["product_type_id"] = 1;
            info["name"] = document.querySelector(".product_detail-title > h1").innerText;
            info["code"] = document.querySelector(".sku").innerText;
            info["price"] = document
                .querySelectorAll("#product-info-price > div> table > tbody >tr")[0]
                .querySelectorAll("td")[1]
                .querySelector("b")
                .innerHTML.replace(/[^0-9]/g, "");
            info["discount"] = document.querySelector("#p-info-price").innerHTML.replace(/[^0-9]/g, "");
            info["description"] = document.querySelector(".product-summary-item-ul").outerHTML.replace(/\n/g, "");
            info["image"] = document.querySelector("#js-big-image > img").src;
            info["quality"] = Math.floor(Math.random() * 5);
            info["warranty"] = document.querySelectorAll(".product-summary-item-title")[1].querySelector("b").innerText;
            info["hot"] = 0;
            info["view"] = 0;

            let spec = "json_encode([\n";
            let table = document.querySelectorAll(".bang-tskt")[0].querySelector("table");
            try {
                if (table != null) {
                    let value = [];
                    let tr = table.querySelectorAll("tbody > tr");
                    let k;
                    if(tr.length==25||tr.length==26){
                        if(tr.length==26) k=1;
                        else if(tr.length==25)k=0;
                        for (let i = k; i < 25+k; i++) {
                            let p = tr[i].querySelectorAll("td")[1].querySelector("p");
                            if (p != null) value.push(p.innerText.replace(/\'/g,'\"'));
                            else value.push("");
                        }
                        for (let i = k; i < 25+k; i++) {
                            if (value[i - k] == "") {
                                spec += "\t\t\t" + (i + 1 - k) + " => null,\n";
                            } else {
                                spec += "\t\t\t" + (i + 1 - k)+" => '" + value[i - k] + "',\n";
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(pro_url);
            }
            
            spec += "\t\t])";
            info["specifications"] = spec;

            return info;
        });
        infos.push(pro);
    }
    let res = "[\n";
    for (let i = 0; i < infos.length; i++) {
        res = res + "\t[\n\t\t";
        res = res + "'admin_id' => " + infos[i].admin_id + ",\n\t\t";
        res = res + "'category_id' => " + infos[i].category_id + ",\n\t\t";
        res = res + "'product_type_id' => " + infos[i].product_type_id + ",\n\t\t";
        res = res + "'name' => '" + infos[i].name + "',\n\t\t";
        res = res + "'slug' => Str::slug('" + infos[i].name + "'),\n\t\t";
        res = res + "'code' => '" + infos[i].code + "',\n\t\t";
        res = res + "'price' => " + infos[i].price + ",\n\t\t";
        res = res + "'discount' => " + infos[i].discount + ",\n\t\t";
        res = res + "'quality' => " + infos[i].quality + ",\n\t\t";
        res = res + "'description' => '" + infos[i].description + "',\n\t\t";
        res = res + "'image' => '" + infos[i].image + "',\n\t\t";
        res = res + "'warranty' => '" + infos[i].warranty + "',\n\t\t";
        res = res + "'specifications' => " + infos[i].specifications + ",\n\t\t";
        res = res + "'view' => " + infos[i].view + ",\n\t\t";
        res = res + "'hot' => " + infos[i].hot + ",\n\t\t";
        res = res + "'created_at' => new DateTime(),\n\t\t";
        res = res + "'updated_at' => new DateTime()";
        res = res + "\n\t],\n";
    }
    res = res + "]";
    await fs.writeFile("output.txt", res, function (err) {
        if (err) throw err;
        console.log("done!");
    });

    await browser.close();
})();
