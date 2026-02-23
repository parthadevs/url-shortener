// A simple IP geolocation utility
// In a production environment, you would use a proper IP geolocation service or database like MaxMind GeoIP

// IP range definitions for countries (very simplified)
type IpRange = {
    start: number
    end: number
    country: string
}

// Convert IP string to a numeric value for range comparison
function ipToLong(ip: string): number {
    const parts = ip.split(".")
    if (parts.length !== 4) return 0

    return (
        ((Number.parseInt(parts[0], 10) << 24) >>> 0) +
        ((Number.parseInt(parts[1], 10) << 16) >>> 0) +
        ((Number.parseInt(parts[2], 10) << 8) >>> 0) +
        Number.parseInt(parts[3], 10)
    )
}

// Sample IP ranges for major countries
// This is a very simplified version - real IP geolocation uses much more detailed databases
const IP_RANGES: IpRange[] = [
    // United States
    { start: ipToLong("3.0.0.0"), end: ipToLong("3.255.255.255"), country: "United States" },
    { start: ipToLong("4.0.0.0"), end: ipToLong("4.255.255.255"), country: "United States" },
    { start: ipToLong("8.0.0.0"), end: ipToLong("8.255.255.255"), country: "United States" },

    // United Kingdom
    { start: ipToLong("51.0.0.0"), end: ipToLong("51.255.255.255"), country: "United Kingdom" },
    { start: ipToLong("62.0.0.0"), end: ipToLong("62.255.255.255"), country: "United Kingdom" },
    { start: ipToLong("86.0.0.0"), end: ipToLong("86.255.255.255"), country: "United Kingdom" },

    // Germany
    { start: ipToLong("77.0.0.0"), end: ipToLong("77.255.255.255"), country: "Germany" },
    { start: ipToLong("178.0.0.0"), end: ipToLong("178.255.255.255"), country: "Germany" },

    // Canada
    { start: ipToLong("24.0.0.0"), end: ipToLong("24.255.255.255"), country: "Canada" },
    { start: ipToLong("99.224.0.0"), end: ipToLong("99.239.255.255"), country: "Canada" },

    // Australia
    { start: ipToLong("1.120.0.0"), end: ipToLong("1.127.255.255"), country: "Australia" },
    { start: ipToLong("203.0.0.0"), end: ipToLong("203.63.255.255"), country: "Australia" },

    // France
    { start: ipToLong("80.0.0.0"), end: ipToLong("80.255.255.255"), country: "France" },
    { start: ipToLong("90.0.0.0"), end: ipToLong("90.255.255.255"), country: "France" },

    // Japan
    { start: ipToLong("133.0.0.0"), end: ipToLong("133.255.255.255"), country: "Japan" },
    { start: ipToLong("126.0.0.0"), end: ipToLong("126.255.255.255"), country: "Japan" },

    // Brazil
    { start: ipToLong("177.0.0.0"), end: ipToLong("177.255.255.255"), country: "Brazil" },
    { start: ipToLong("191.0.0.0"), end: ipToLong("191.255.255.255"), country: "Brazil" },

    // China
    { start: ipToLong("58.0.0.0"), end: ipToLong("58.255.255.255"), country: "China" },
    { start: ipToLong("59.0.0.0"), end: ipToLong("59.255.255.255"), country: "China" },
    { start: ipToLong("123.0.0.0"), end: ipToLong("123.255.255.255"), country: "China" },

    // India
    { start: ipToLong("117.0.0.0"), end: ipToLong("117.255.255.255"), country: "India" },
    { start: ipToLong("122.0.0.0"), end: ipToLong("122.255.255.255"), country: "India" },
    { start: ipToLong("103.0.0.0"), end: ipToLong("103.255.255.255"), country: "India" },

    // Russia
    { start: ipToLong("5.0.0.0"), end: ipToLong("5.255.255.255"), country: "Russia" },
    { start: ipToLong("178.64.0.0"), end: ipToLong("178.127.255.255"), country: "Russia" },

    // South Korea
    { start: ipToLong("1.208.0.0"), end: ipToLong("1.223.255.255"), country: "South Korea" },
    { start: ipToLong("175.192.0.0"), end: ipToLong("175.223.255.255"), country: "South Korea" },

    // Indonesia
    { start: ipToLong("36.64.0.0"), end: ipToLong("36.127.255.255"), country: "Indonesia" },
    { start: ipToLong("110.136.0.0"), end: ipToLong("110.143.255.255"), country: "Indonesia" },

    // South Africa
    { start: ipToLong("41.0.0.0"), end: ipToLong("41.255.255.255"), country: "South Africa" },
    { start: ipToLong("102.128.0.0"), end: ipToLong("102.191.255.255"), country: "South Africa" },
    // Bangladesh
    { start: ipToLong("103.4.12.0"), end: ipToLong("103.4.15.255"), country: "Bangladesh" },
    { start: ipToLong("103.48.16.0"), end: ipToLong("103.48.31.255"), country: "Bangladesh" },
    { start: ipToLong("103.112.96.0"), end: ipToLong("103.112.127.255"), country: "Bangladesh" },
    { start: ipToLong("114.130.0.0"), end: ipToLong("114.130.127.255"), country: "Bangladesh" },
    { start: ipToLong("103.152.84.0"), end: ipToLong("103.152.87.255"), country: "Bangladesh" },
    { start: ipToLong("203.76.96.0"), end: ipToLong("203.76.127.255"), country: "Bangladesh" },
    { start: ipToLong("27.147.128.0"), end: ipToLong("27.147.191.255"), country: "Bangladesh" },
    { start: ipToLong("103.4.144.0"), end: ipToLong("103.4.151.255"), country: "Bangladesh" },
    { start: ipToLong("203.112.160.0"), end: ipToLong("203.112.191.255"), country: "Bangladesh" },
    { start: ipToLong("45.112.48.0"), end: ipToLong("45.112.63.255"), country: "Bangladesh" },
];


/**
 * Get country from IP address
 * @param ip IP address in string format (e.g., "192.168.1.1")
 * @returns Country name or null if not found
 */
export function getCountryFromIP(ip: string | null): string | null {
    if (!ip) return null

    try {
        const ipLong = ipToLong(ip)

        // Find matching IP range
        for (const range of IP_RANGES) {
            if (ipLong >= range.start && ipLong <= range.end) {
                return range.country
            }
        }

        // For localhost or private IPs
        if (
            ip.startsWith("127.") ||
            ip.startsWith("10.") ||
            ip.startsWith("192.168.") ||
            (ip.startsWith("172.") &&
                Number.parseInt(ip.split(".")[1], 10) >= 16 &&
                Number.parseInt(ip.split(".")[1], 10) <= 31)
        ) {
            return "Local Network"
        }

        return "Unknown"
    } catch (error) {
        console.error("Error processing IP address:", error)
        return null
    }
}

/**
 * Group and calculate percentages for location data
 * @param locationCounts Record of country counts
 * @param total Total number of records
 * @returns Array of location data with percentages
 */
export function processLocationCounts(
    locationCounts: Record<string, number>,
    total: number,
): Array<{ name: string; value: number }> {
    // Convert to array and sort by count
    const countriesArray = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

    // Take top 5 countries and group the rest as "Other"
    const topCountries = countriesArray.slice(0, 5)
    const otherCount = countriesArray.slice(5).reduce((sum, country) => sum + country.count, 0)

    // Calculate percentages
    const result = topCountries.map((country) => ({
        name: country.name === "Unknown" ? "Other" : country.name,
        value: Math.round((country.count / total) * 100),
    }))

    // Add "Other" if there are more than 5 countries
    if (otherCount > 0) {
        result.push({
            name: "Other",
            value: Math.round((otherCount / total) * 100),
        })
    }

    // Ensure percentages sum to 100%
    const sum = result.reduce((sum, item) => sum + item.value, 0)
    if (sum !== 100 && result.length > 0) {
        result[0].value += 100 - sum
    }

    return result
}
