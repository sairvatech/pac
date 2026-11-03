function FindProxyForURL(url, host) {
    host = host.toLowerCase();

    // 1. LOCAL & INTERNAL TRAFFIC (DIRECT - NO PROXY)
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.lan") ||
        shExpMatch(host, "127.*") || 
        host === "localhost") {
        return "DIRECT";
    }

    var resolvedIP = dnsResolve(host);
    // Direct for new local LAN (172.31.10.0/26) and KSWAN switch subnet (10.122.171.16/28)
    if (isInNet(resolvedIP, "172.31.10.0", "255.255.255.192") ||
        isInNet(resolvedIP, "10.122.171.16", "255.255.255.240")) {
        return "DIRECT";
    }

    // 2. KSWAN / KERALA GOVT WEB PORTALS -> SQUID PROXY
    if (shExpMatch(host, "*.kerala.gov.in") ||
        shExpMatch(host, "*.gov.in") ||
        shExpMatch(host, "*.nic.in") ||
        shExpMatch(host, "*.spark.gov.in") ||
        shExpMatch(host, "*.etenders.kerala.gov.in") ||
        shExpMatch(host, "*.treasury.kerala.gov.in") ||
        shExpMatch(host, "*.eoffice.kerala.gov.in") ||
        shExpMatch(host, "*.ilkms.kerala.gov.in") ||
        shExpMatch(host, "*.bims.kerala.gov.in") ||
        shExpMatch(host, "*.tax.kerala.gov.in")) {
        return "PROXY 10.1.6.20:3128; DIRECT";
    }

    // Direct access to internal 10.x.x.x addresses if reached via IP
    if (isInNet(resolvedIP, "10.0.0.0", "255.0.0.0") &&
        !isInNet(resolvedIP, "10.122.171.16", "255.255.255.240")) {
        return "PROXY 10.1.6.20:3128; DIRECT";
    }

    // 3. GENERAL INTERNET -> DIRECT VIA BSNL
    return "DIRECT";
}
