function FindProxyForURL(url, host) {
    // Standardize host string to lowercase
    host = host.toLowerCase();

    // =========================================================================
    // 1. LOCAL HOSTS, LOOPBACK, & LOCAL OFFICE LAN BYPASS (DIRECT)
    // =========================================================================
    if (isPlainHostName(host) || 
        shExpMatch(host, "*.local") || 
        shExpMatch(host, "*.lan") ||
        shExpMatch(host, "127.*") || 
        host === "localhost") {
        return "DIRECT";
    }

    var resolvedIP = dnsResolve(host);

    // Bypass proxy for local office subnet (172.31.10.0/24)
    // and directly connected KSWAN interface subnet (10.122.171.16/28)
    if (isInNet(resolvedIP, "172.31.10.0", "255.255.255.0") ||
        isInNet(resolvedIP, "10.122.171.16", "255.255.255.240")) {
        return "DIRECT";
    }

    // =========================================================================
    // 2. EXPLICIT BYPASS: VPN GATEWAY MUST GO DIRECT VIA BSNL
    // =========================================================================
    // Prevents SSL/IPsec VPN endpoint from routing through the internal proxy
    if (dnsDomainIs(host, "evpn.kerala.gov.in") ||
        shExpMatch(host, "*.evpn.kerala.gov.in")) {
        return "DIRECT";
    }

    // =========================================================================
    // 3. EXCLUSIVE PROXY ROUTE: ONLY E-OFFICE RCS PORTAL
    // =========================================================================
    // Matches eofficercs.kerala.gov.in and any sub-services/attachments on it
    if (dnsDomainIs(host, "eofficercs.kerala.gov.in") || 
        shExpMatch(host, "*.eofficercs.kerala.gov.in")) {
        return "PROXY 10.1.6.20:3128; DIRECT";
    }

    // =========================================================================
    // 4. GENERAL INTERNET & ALL OTHER GOVT PORTALS (DIRECT VIA BSNL)
    // =========================================================================
    // All regular browsing, Google, YouTube, and portals accessed via VPN go direct
    return "DIRECT";
}
