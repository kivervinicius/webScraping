const Nightmare = require('nightmare')
const tabletojson = require('tabletojson');
const name = 'william'
const userAngents = [
  'GoogleBot', 'googbot', 'Google',
  'user', 'normal', 'simple',
  'life', 'notbot', 'oxes',
  '008', 'Arachmo', 'Baiduspider',
  'Cerberian Drtrs', 'Charlotte',
  'FindLinks', 'Holmes', 'htdig',
  'ia_archiver', 'ichiro'
]

const START = 'https://sanctionssearch.ofac.treas.gov'

function randomAnget() {
  var item = userAngents[Math.floor(Math.random() * userAngents.length)]
  console.log(item)
  return item
}

const getAddress = async id => {
  console.log(`Now checking ${id}`)
  const nightmare = new Nightmare({
    typeInterval: 20,
    show: true,
    switches: {
      'proxy-server': 'proxy.unipam.edu.br:3128' // set the proxy server here ...
    },
    waitTimeout: 15000
  })

  try {
    await nightmare
      .authentication('a12027962', '32900596')
      .cookies.clearAll()
      .goto(START)
      .wait('#ctl00_MainContent_pnlSearch')
      .click('#ctl00_MainContent_pnlSearch')
  } catch (e) {
    console.error(e)
  }

  try {
    await nightmare
      .wait('input[name="ctl00$MainContent$txtLastName"]')
      .type('input[name="ctl00$MainContent$txtLastName"]', id)
      .click('input[value="Search"]')
  } catch (e) {
    console.error(e)
  }

  try {
    const result = await nightmare
      .wait('table#gvSearchResults')
      .evaluate(() => {
        let count =  Array.apply(null, document.querySelectorAll('table#gvSearchResults tbody tr'))
          .map(el => el.innerText)

        return count.length
      })
      .end()
    return {
      result
    }
  } catch (e) {
    console.error(e)
    return undefined
  }

}

getAddress(name)
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
