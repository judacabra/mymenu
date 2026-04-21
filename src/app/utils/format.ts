export default class Format {
    public formatLocalCurrency(
        amount: number | string,
        useCurrencySymbol: boolean = false,
        currencyCode: string = 'COP'
    ): string {
        const numericAmount: number = typeof amount === 'string' ? parseFloat(amount) : amount;

        if (isNaN(numericAmount)) {
            throw new Error('El valor proporcionado no es un número válido');
        }

        const options: Intl.NumberFormatOptions = {
            style: useCurrencySymbol ? 'currency' : 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            useGrouping: true
        };

        if (useCurrencySymbol) {
            options.currency = currencyCode;
        }

        let lng: string = "en-ES";

        if (currencyCode == 'COP') {
            lng = "es-CO"
        }

        return new Intl.NumberFormat(lng, options).format(numericAmount);
    }
}