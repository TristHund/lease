interface Property {
  balance: number;
}

let activeProperty: Property = {
  balance: 1,
};

export const getBalance = () => BigInt(activeProperty.balance);

export const setBalance = (newBalance: number) => {
  activeProperty.balance = newBalance;
};
