import { faker } from "@faker-js/faker";
import { ColumnSort, SortingState } from "@tanstack/react-table";

export type Report = {
	id: number;
	date: string;
	interCompany: string;
	billingCountry: string;
	revenueReportedCountry: string;
	channel: string;
	supply: string;
	brand: string;
	oemMapping: string;
	demand: string;
	ioNumber: string;
	cioNumber: string;
	glanceChildImageNumber: string;
	glft: string;
	billableRevenue: string;
	freeTrialAmount: string;
	grossRevenue: string;
	sfAccountName: string;
	sfId: string;
	sumOfGlances: string;
	discountValue: string;
	salesPrice: string;
	ioBudgetAvailable: string;
	opportunitySegment: string;
	syncStatus: string;
	discountType: string;
	discountStatus: string;
	sfAccountId: string;
	productName: string;
	pricingModel: string;
	salesPriceCurrency: string;
	revopsTeam: string;
};

export type ReportAPIResponse = {
	data: Report[];
	meta: {
		totalRowCount: number;
	};
};

const range = (len: number) => {
	const arr: number[] = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

const newReport = (index: number): Report => {
	return {
		id: index + 1,
		date: faker.date.month(),
		interCompany: faker.person.firstName(),
		billingCountry: faker.location.country(),
		revenueReportedCountry: faker.location.country(),
		channel: faker.commerce.department(),
		supply: faker.commerce.productName(),
		brand: faker.company.name(),
		oemMapping: faker.location.countryCode(),
		demand: faker.commerce.productMaterial(),
		ioNumber: faker.number.int(10000).toString(),
		cioNumber: faker.number.int(10000).toString(),
		glanceChildImageNumber: faker.number.int(1000).toString(),
		glft: faker.person.firstName(),
		billableRevenue: faker.number.int(10000).toString(),
		freeTrialAmount: faker.number.int(10000).toString(),
		grossRevenue: faker.number.int(10000).toString(),
		sfAccountName: faker.commerce.productName(),
		sfId: faker.internet.ip(),
		sumOfGlances: faker.number.int(10000).toString(),
		discountValue: faker.number.int(10000).toString(),
		salesPrice: faker.number.int(10000).toString(),
		ioBudgetAvailable: faker.number.int(10000).toString(),
		opportunitySegment: faker.number.int(10000).toString(),
		syncStatus: faker.number.int(10000).toString(),
		discountType: faker.number.int(10000).toString(),
		discountStatus: faker.number.int(10000).toString(),
		sfAccountId: faker.number.int(10000).toString(),
		productName: faker.company.name(),
		pricingModel: faker.number.int(10000).toString(),
		salesPriceCurrency: faker.number.int(10000).toString(),
		revopsTeam: faker.number.int(10000).toString(),
	};
};

export function makeData(...lens: number[]) {
	const makeDataLevel = (depth = 0): Report[] => {
		const len = lens[depth]!;
		return range(len).map((d): Report => {
			return {
				...newReport(d),
			};
		});
	};

	return makeDataLevel();
}

const data = makeData(10000);

//simulates a backend api
export const fetchData = async (start: number, size: number, sorting: SortingState) => {
	const dbData = [...data];
	if (sorting.length) {
		const sort = sorting[0] as ColumnSort;
		const { id, desc } = sort as { id: keyof Report; desc: boolean };
		dbData.sort((a, b) => {
			if (desc) {
				return a[id] < b[id] ? 1 : -1;
			}
			return a[id] > b[id] ? 1 : -1;
		});
	}

	//simulate a backend api
	await new Promise((resolve) => setTimeout(resolve, 200));

	return {
		data: dbData.slice(start, start + size),
		meta: {
			totalRowCount: dbData.length,
		},
	};
};
