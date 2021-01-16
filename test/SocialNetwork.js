const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork', ([deployer, author, tipper]) => {
    let socialNetwork

    before(async () => {
        socialNetwork = await SocialNetwork.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            socialNetwork = await SocialNetwork.deployed()
            const address = await socialNetwork.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await socialNetwork.name()
            assert.equal(name, 'Alfonz Social Network')
        })
    })

    describe('posts', async () => {
        let result, postCount

        it('creates posts', async () => {
            result = await socialNetwork.createPost(
                'This is my first post!',
                { from: author }
            );

            postCount = await socialNetwork.postCount()

            // success
            assert.equal(postCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post!', 'content is correct')
            assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            // failure
            await socialNetwork.createPost(
                '',
                { from: author }
            ).should.be.rejected;
        })

        it('lists posts', async () => {
            const post = await socialNetwork.posts(postCount)
            assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(post.content, 'This is my first post!', 'content is correct')
            assert.equal(post.tipAmount, '0', 'tip amount is correct')
            assert.equal(post.author, author, 'author is correct')
        })

        it('allows users to tip posts', async () => {
            // track author balance before purchase
            let oldBalance = await web3.eth.getBalance(author)
            let oldAuthorBalance = new web3.utils.BN(oldBalance) // BN = big number

            result = await socialNetwork.tipPost(
                postCount,
                {
                    from: tipper,
                    value: web3.utils.toWei('1', 'Ether')
                }
            )

            // success
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
            assert.equal(event.content, 'This is my first post!', 'content is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')

            let newBalance = await web3.eth.getBalance(author)
            let newAuthorBalance = new web3.utils.BN(newBalance)

            let tip = web3.utils.toWei('1', 'Ether')
            let tipAmount = new web3.utils.BN(tip)

            const expectedBalance = oldAuthorBalance.add(tipAmount)
            assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

            // failure: try to tip a post that does not exist
            await socialNetwork.tipPost(
                99,
                {
                    from: tipper,
                    value: web3.utils.toWei('1', 'Ether')
                }
            ).should.be.rejected
        })
    })
})