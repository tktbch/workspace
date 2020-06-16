import jwt from "jsonwebtoken";

const defaultPayload = {
    id: 'abc123def',
    email: 'test@test.com'
};

export const getCookie = (payload = defaultPayload): string[] => {
    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    // Build Session Object { jwt: MY_JWT }
    const session = { jwt: token };
    // Turn that Session into JSON
    const sessionJSON = JSON.stringify(session);
    // base64 enocode
    const base64 = Buffer.from(sessionJSON).toString('base64');
    // return a string with express:sess=[TOKEN]
    return [`express:sess=${base64}`];
}
