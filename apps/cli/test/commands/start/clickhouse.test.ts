import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('start:clickhouse', () => {
  it('runs start:clickhouse cmd', async () => {
    const {stdout} = await runCommand('start:clickhouse')
    expect(stdout).to.contain('hello world')
  })

  it('runs start:clickhouse --name oclif', async () => {
    const {stdout} = await runCommand('start:clickhouse --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
