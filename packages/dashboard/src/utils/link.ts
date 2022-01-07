export default {};

export const toICRocksPrincipal = (id: string) => {
    const path = id.includes('-') ? 'principal' : 'account';
    return `https://ic.rocks/${path}/${id}`;
}
