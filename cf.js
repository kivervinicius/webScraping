const Nightmare = require('nightmare')

const nome = 'dilma rousseff'
const userAgents = [
  'GoogleBot', 'googbot', 'Google',
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)',
  'normal', 'simple',
  'life', 'notbot', 'oxes',
  '008', 'Arachmo', 'Baiduspider',
  'Cerberian Drtrs', 'Charlotte',
  'FindLinks', 'Holmes', 'htdig',
  'ia_archiver', 'ichiro'
]

const START = 'http://www.cjf.jus.br/juris/unificada/Resposta'

function randomAgent() {
  var item = userAgents[Math.floor(Math.random() * userAgents.length)]
  console.log(item)
  return item
}

function loop(array) {
  for(let i = 0; i < array.length; i++) {
    return array[i]
  }
}

const getAddress = async id => {
  console.log(`Now checking ${id}`)
  const nightmare = new Nightmare({
    typeInterval: 20,
    show: true,
    switches: {
      'proxy-server': 'proxy.unipam.edu.br:3128' // set the proxy server here ...
    },
    //waitTimeout: 60000
  })

  try {
    await nightmare
      .authentication('a12027962', '32900596')
      .cookies.clearAll()
      .goto(START)
      .useragent(randomAgent())
      .wait('.table_form')
      .click('.table_form')
  } catch (e) {
    console.error(e)
  }

  try {
    await nightmare
      .wait('input[name="livreAvancada"]')
      .type('input[name="livreAvancada"]', id)
      .click('input[value="TODAS"]')
      // .click('input[value="RESUMIDA"]')
      .click('input[value="Pesquisar"]')
  } catch (e) {
    console.error(e)
  }

  try {
    await nightmare
    .wait('#botoes')
  } catch (e) {
    console.error(e)
  }

  try {
    //let arr = []
    const results = await nightmare
      .wait('.table_resultado')
      .evaluate(() => {
        // let result = [],
        //     row = [],
        //     cells = Array.apply(null, document.querySelectorAll('table.table_resultado tbody tr td'))
        //
        // for (var i = 0; i < cells.length; i++) {
        //   row.push(cells.map(el => el.innerText))
        // }
        //
        // result.push(row)
        //
        // return result

        let cells = Array.apply(null, document.querySelectorAll('table.table_pesquisa_lista tbody tr'))
                          .map(el => el.innerText)

        let newCells = cells.map((arr) => { return arr.replace(/\n/g, ' ') })

        let novaCells = newCells.map((arr) => { return arr.replace(/\t/g, ' ') })

        return novaCells[2]
      })
      .end()
    return results
  } catch (e) {
    console.error(e)
    // return undefined
  }
}

getAddress(nome)
  .then(a => console.dir(a))
  .catch(e => console.error(e))
