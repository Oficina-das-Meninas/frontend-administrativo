export interface Donation {
  id: string;
	value: number;
	donationAt: Date;
	userId: string;
	status: string;
	donationType?: string;
	donorName?: string;
	sponsorStatus?: string;
	sponsorStatusLabel?: string;
	sponsorStatusRaw?: string;
}
