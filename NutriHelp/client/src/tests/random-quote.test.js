import randomQuote from "../assets/js/quotes";

const quote = randomQuote().props.children

test("returns quote & author", () => {
    expect(typeof quote[0].props.children).toBe("string")
    expect(typeof quote[1].props.children.join()).toBe("string")
    
    expect(quote[0].props.children).toBeTruthy()
    expect(quote[1].props.children.join()).toBeTruthy()
})