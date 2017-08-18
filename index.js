const Nightmare = require('nightmare')

const cpf = '054.398.309-95'
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

const START = 'https://www.situacaocadastral.com.br'

function randomAgent() {
  var item = userAgents[Math.floor(Math.random() * userAgents.length)]
  console.log(item)
  return item
}

const getAddress = async id => {
  console.log(`Now checking ${id}`)
  const nightmare = new Nightmare({
    typeInterval: 20,
    //show: true,
    switches: {
      'proxy-server': 'proxy.unipam.edu.br:3128' // set the proxy server here ...
    },
    //waitTimeout: 10000
  })

  try {
    await nightmare
      .authentication('a12027962', '32900596')
      .cookies.clearAll()
      .wait(3000)
      .goto(START)
      .useragent(randomAgent())
      .wait('#topo')
      .click('#topo')
  } catch (e) {
    console.error(e)
  }

  try {
    await nightmare
      .wait('input[name="doc"]')
      .type('input[name="doc"]', id)
      .wait(5000)
      .click('input[value="L"]')
  } catch (e) {
    console.error(e)
  }

  try {
    const result = await nightmare
      .wait('#resultado')
      .evaluate(() => {
        return [...document.querySelectorAll('.dados')]
          .map(el => el.innerText)
      })
      .end()
    return {
      id: id,
      nome: result[0],
      situacao: result[1]
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}

getAddress(cpf)
  .then(a => console.dir(a))
  .catch(e => console.error(e))
