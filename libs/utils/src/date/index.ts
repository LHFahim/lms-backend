export const getAmountForRemainingDaysOfMonth = (amount: number) => {
	// todo set comparator date to next month's first day at 12AM

	const today = new Date();
	const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
	const daysLeft = daysInMonth - today.getDate();
	return (amount / daysInMonth) * (daysLeft > 30 ? 30 : daysLeft);
};
