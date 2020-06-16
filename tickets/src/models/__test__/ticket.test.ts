import {Ticket} from "../ticket";

describe('Ticket model', () => {

    it('implements optimistic concurrency control', async (done) => {
        const ticket = Ticket.build({
            title: 'test',
            price: 5,
            userId: '123'
        })
        await ticket.save();

        const t1 = await Ticket.findById(ticket.id);
        const t2 = await Ticket.findById(ticket.id);

        t1!.set({ price: 20});
        t2!.set({ price: 50});

        await t1!.save();

        try {
            await t2!.save();
        } catch (e) {
            return done();
        }
        throw new Error('should not reach this point');
    })

    it('increments the version number on save', async () => {
        const ticket = Ticket.build({
            title: 'test',
            price: 5,
            userId: '123'
        })
        await ticket.save();
        expect(ticket.version).toBe(0);

        ticket.set({ price: 20});
        await ticket.save();
        expect(ticket.version).toBe(1);

        ticket.set({ price: 30});
        await ticket.save();
        expect(ticket.version).toBe(2);

    })

})
