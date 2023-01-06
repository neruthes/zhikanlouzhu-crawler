const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');
const sh = require('child_process').execSync;

const webpageUrlBase = process.argv[2];
const pageRangeStart = process.argv[3];
const pageRangeEnd = process.argv[4];

const jobHash = sh(`sha256sum <<< '${webpageUrlBase}'`).toString().slice(0, 20);
console.log(`jobHash: ${jobHash}`);
sh(`mkdir -p db/${jobHash}`);


const leftpadnum = function (num, length) {
    const str = num.toString();
    if (str.length < length) {
        return (new Array(length-str.length)).fill('0').join('') + str;
    } else {
        return str;
    };
};

const getPageByUrl = function (targetWebpageUrl, pageMark) {
    console.log(`[INFO] Working on page ${pageMark}`);
    const rawhtml = sh(`curl '${targetWebpageUrl}' 2>/dev/null`);
    const $ = cheerio.load(rawhtml);
    const pageContentText = $('.content.box').text();
    fs.writeFileSync(`./db/${jobHash}/${pageMark}.txt`, pageContentText);
};





(async function () {

    for (let i = pageRangeStart; i <= pageRangeEnd; i++) {
        setTimeout(() => {
            getPageByUrl(webpageUrlBase + i + '.html', leftpadnum(i));
        }, 4000);
    }

})();
