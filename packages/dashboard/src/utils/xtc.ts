// TODO: Use external API or Service to get IMG SDR Valuation
// by default this is hardtyped at latest known value 1.39 ~ 1.43
// https://www.imf.org/external/np/fin/data/rms_sdrv.aspx
const IMF_SDR_RATE = 1.40;
export const getXTCMarketValue = (xtc: bigint) => Number(xtc) * IMF_SDR_RATE;
