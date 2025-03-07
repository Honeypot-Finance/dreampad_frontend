import { Currency, CurrencyAmount, Fraction, Percent, Trade, TradeType } from "@cryptoalgebra/sdk"
import JSBI from "jsbi"

export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
const ONE_HUNDRED_PERCENT = new Percent(JSBI.BigInt(10000), JSBI.BigInt(10000))

export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%


export function computeRealizedLPFeePercent(
    trade: Trade<Currency, Currency, TradeType>
): Percent {

    const percent = ONE_HUNDRED_PERCENT.subtract(
        trade.route.pools.reduce<Percent>(
            (currentFee: Percent, pool): Percent =>
                currentFee.multiply(ONE_HUNDRED_PERCENT.subtract(new Fraction(pool.fee, 1_000_000))),
            ONE_HUNDRED_PERCENT
        )
    )

    return new Percent(percent.numerator, percent.denominator)
}

export function computeRealizedLPFeeAmount(
    trade?: Trade<Currency, Currency, TradeType> | null
): CurrencyAmount<Currency> | undefined {
    if (trade) {
        const realizedLPFee = computeRealizedLPFeePercent(trade)

        return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, trade.inputAmount.multiply(realizedLPFee).quotient)
    }

    return undefined
}

const IMPACT_TIERS = [
    BLOCKED_PRICE_IMPACT_NON_EXPERT,
    ALLOWED_PRICE_IMPACT_HIGH,
    ALLOWED_PRICE_IMPACT_MEDIUM,
    ALLOWED_PRICE_IMPACT_LOW
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4

export function warningSeverity(priceImpact: Percent | undefined): WarningSeverity {
    if (!priceImpact) return 4
    let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
    for (const impactLevel of IMPACT_TIERS) {
        if (impactLevel.lessThan(priceImpact)) return impact
        impact--
    }
    return 0
}
