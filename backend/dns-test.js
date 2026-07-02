const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.hackradar-cluster.qyztrbh.mongodb.net",
  (err, records) => {
    if (err) {
      console.error(err);
    } else {
      console.log(records);
    }
  }
);