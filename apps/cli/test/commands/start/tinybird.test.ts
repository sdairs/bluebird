import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('start:tinybird', () => {
  it('runs start:tinybird cmd', async () => {
    const {stdout} = await runCommand('start:tinybird')
    expect(stdout).to.contain('hello world')
  })

  it('runs start:tinybird --name oclif', async () => {
    const {stdout} = await runCommand('start:tinybird --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
