function FindProxyForURL(url, host) {
    // Convert hostname to lowercase for accurate matching
    host = host.toLowerCase();

    // 1. LOCAL & INTERNAL LAN TRAFFIC (DIRECT)
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.lan") ||
        shExpMatch(host, "127.*") || 
        host === "localhost") {
        return "DIRECT";
    }

    var resolvedIP = dnsResolve(host);
    if (isInNet(resolvedIP, "172.31.10.0", "255.255.255.0") ||
        isInNet(resolvedIP, "10.122.171.16", "255.255.255.240")) {
        return "DIRECT";
    }

    // 2. EXCLUSIVE ROUTE: ONLY eofficercs.kerala.gov.in VIA KSWAN PROXY
    if (dnsDomainIs(host, "eofficercs.kerala.gov.in") || 
        shExpMatch(host, "*.eofficercs.kerala.gov.in")) {
        return "PROXY 10.1.6.20:3128; DIRECT";
    }

    // 3. ALL OTHER TRAFFIC (DIRECT VIA BSNL FIBER)
    // All other websites and general .gov.in portals bypass the proxy completely
    return "DIRECT";
}
