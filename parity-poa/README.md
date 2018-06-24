# Parity Proof-of-Authority

Parity based Proof-of-Authority network with 3 authority nodes and 3 user nodes.

### Setup

0. Install [docker](https://docs.docker.com/engine/installation/) and [docker-compose](https://docs.docker.com/compose/install/)
1. Run in `/parity-poa` directory: `docker-compose up`

### Access the [ethstats](https://github.com/cubedro/eth-netstats) dashboard.
A nice dashboard is already configured and connected with all the nodes.
Find it at [http://127.0.0.1:3001](http://127.0.0.1:3001).

### Accounts
There is already an account with an empty password that has enough ether:

#### Address
```
0x6B0c56d1Ad5144b4d37fa6e27DC9afd5C2435c3B
```
#### Private Key
```
8e9ecc536c1d533af6669071385c67e8cc5c49908f57a2b0b2ce4889d8abafda
```

Additional prefunded accounts can be found in `parity/config/chain.json`.