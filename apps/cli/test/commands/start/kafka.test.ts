import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('start:kafka', () => {
  it('runs start:kafka cmd', async () => {
    const {stdout} = await runCommand('start:kafka')
    expect(stdout).to.contain('hello world')
  })

  it('runs start:kafka --name oclif', async () => {
    const {stdout} = await runCommand('start:kafka --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
