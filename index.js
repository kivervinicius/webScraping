const { csvFormat } = require('d3-dsv')
const Nightmare = require('nightmare')
const { readFileSync, writeFileSync } = require('fs')
//var cheerio = require('cheerio')
// const numbers = readFileSync('./tesco-title-numbers.csv',
//   {encoding: 'utf8'}).trim().split('\n')
const cpf = '044.698.029-30'
      //data = '04/09/1979'

const START = 'https://www.example.com.br'

const getAddress = async id => {
  console.log(`Now checking ${id}`)
  const nightmare = new Nightmare({
    show: true,
    switches: {
      'proxy-server': 'proxy.unipam.edu.br:3128' // set the proxy server here ...
    },
    waitTimeout: 10000
  })
// Go to initial start page, navigate to Detail search

  try {
    await nightmare
      .authentication('aaaa', 'aaa')
      //.clearCache()
      .cookies.clearAll()
      .goto(START, [{'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36 OPR/46.0.2597.57'}])
      .wait('#topo')
      .click('#topo')
  } catch(e) {
    console.error(e)
  }

  try {
    await nightmare
      .wait('input[name="doc"]')
      .type('input[name="doc"]', id)
      .click('input[value="L"]')
  } catch(e) {
    console.error(e)
  }

  try {
    const result = await nightmare
      .wait('#resultado')
      .evaluate(() => {
        return [...document.querySelectorAll('#resultado')]
          .map(el => el.innerText)
      })
      .end()
    return { id, address: result[0], lease: result[1] }
    // console.log(json.address)
    // return json
  } catch(e) {
    console.error(e)
    return undefined
  }
}

getAddress(cpf)
  .then(a => console.dir(a))
  .catch(e => console.error(e))

/**
  * Salvar resultados em planilha
  */
// const series = cpf.reduce(async (queue, cpf) => {
//   const dataArray = await queue
//   dataArray.push(await getAddress(cpf))
//   console.log(dataArray)
//   return dataArray
// }, Promise.resolve([]))

// series.then(data => {
//   const csvData = csvFormat(data.filter(i => i))
//   //writeFileSync('./output.csv', csvData, { encoding: 'utf8' })
//   console.log()
// })
.catch(e => console.error(e))
