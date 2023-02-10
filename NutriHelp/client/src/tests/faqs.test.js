import FAQs from "../assets/js/faqs"

test('is valid FAQ object', () => {
    FAQs.forEach(obj => {
        expect(obj).toHaveProperty("Q")
        expect(obj).toHaveProperty("A")

        expect(typeof obj.Q).toBe("string")
        expect(typeof obj.A).toBe("string")

        expect(obj.Q).toBeTruthy()
        expect(obj.Q).toBeTruthy()

    })
})