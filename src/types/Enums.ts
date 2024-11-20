export enum SERVER_PACKET {
    AUTH = 1,
    UpdatePOS = 2
}

export enum GAME_PACKET {
    Authorize = 1,
    SpawnPlayer = 2,
    SpawnMap = 3, // WIP
    PlayerMove = 4,
    PlayerUpdates = 5 // this is from cameraupdates and more!
}