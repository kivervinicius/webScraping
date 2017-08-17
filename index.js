const Nightmare = require('nightmare')

const cpf = '054.398.309-95'
const userAgents = [
  'GoogleBot', 'googbot', 'Google',
  'user', 'normal', 'simple',
  'life', 'notbot', 'oxes',
  '008', 'Arachmo', 'Baiduspider',
  'Cerberian Drtrs', 'Charlotte',
  'FindLinks', 'Holmes', 'htdig',
  'ia_archiver', 'ichiro'
]

const START = 'https://www.situacaocadastral.com.br'

function randomAgent() {
  var item = userAgents[Math.floor(Math.random() * userAngents.length)]
  console.log(item)
  return item
}

const getAddress = async id => {
  console.log(`Now checking ${id}`)
  const nightmare = new Nightmare({
    typeInterval: 20,
    show: false,
    switches: {
      'proxy-server': 'proxy.unipam.edu.br:3128' // set the proxy server here ...
    },
    waitTimeout: 10000
  })

  try {
    await nightmare
      .authentication('a12027962', '32900596')
      .cookies.clearAll()
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
// .catch(e => console.error(e))
