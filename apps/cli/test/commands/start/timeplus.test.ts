import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('start:timeplus', () => {
  it('runs start:timeplus cmd', async () => {
    const {stdout} = await runCommand('start:timeplus')
    expect(stdout).to.contain('hello world')
  })

  it('runs start:timeplus --name oclif', async () => {
    const {stdout} = await runCommand('start:timeplus --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
