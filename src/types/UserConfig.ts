export interface UserConfig {
  // Map Name (this uses the map file)
  map: string;

  // User Scripts folder, these are custom scripts
  scripts?: string | "./scripts";

  /* 
    Map folder, these are user made maps
    this is the map that loads
  */
  map_dir?: string | "./map";

  // Port hosting the server (default is 8080)
  port: number | 8080

  // Disables HostKey Auth Checks (anyone can join with ip/port)
  localhost?: boolean

  // Host Key for blockverse
  host_key: string
}
