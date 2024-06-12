"use client";

import React from "react";
import ReactDOM from "react-dom/client";
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	OnChangeFn,
	Row,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { keepPreviousData, QueryClient, QueryClientProvider, useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";

import { fetchData, Report, ReportAPIResponse } from "./mockData";

const fetchSize = 50;

const queryClient = new QueryClient();

function MockTable() {
	//we need a reference to the scrolling element for logic down below
	const tableContainerRef = React.useRef<HTMLDivElement>(null);

	const [sorting, setSorting] = React.useState<SortingState>([]);

	const columns = React.useMemo<ColumnDef<Report>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				size: 60,
			},
			{
				accessorKey: "date",
				id: "date",
				header: () => <span>Date</span>,
			},
			{
				accessorKey: "interCompany",
				id: "interCompany",
				header: () => <span>Inter Company</span>,
			},
			{
				accessorKey: "billingCountry",
				id: "billingCountry",
				header: () => <span>Billing Company</span>,
			},
			{
				accessorKey: "revenueReportedCountry",
				id: "revenueReportedCountry",
				header: () => <span>Revenue Reported Company</span>,
			},
			{
				accessorKey: "channel",
				id: "channel",
				header: () => <span>Channel</span>,
			},
			{
				accessorKey: "supply",
				id: "supply",
				header: () => <span>Supply</span>,
			},
			{
				accessorKey: "brand",
				id: "brand",
				header: () => <span>Brand</span>,
			},
			{
				accessorKey: "oemMapping",
				id: "oemMapping",
				header: () => <span>OEM Mapping</span>,
			},
			{
				accessorKey: "demand",
				id: "demand",
				header: () => <span>Demand</span>,
			},
			{
				accessorKey: "ioNumber",
				id: "ioNumber",
				header: () => <span>IO Number</span>,
			},
			{
				accessorKey: "cioNumber",
				id: "cioNumber",
				header: () => <span>CIO Number</span>,
			},
			{
				accessorKey: "glanceChildImageNumber",
				id: "glanceChildImageNumber",
				header: () => <span>Glance Child No</span>,
			},
			{
				accessorKey: "glft",
				id: "glft",
				header: () => <span>GLFT</span>,
			},
			{
				accessorKey: "billableRevenue",
				id: "billableRevenue",
				header: () => <span>Billable Revenue</span>,
			},
			{
				accessorKey: "freeTrialAmount",
				id: "freeTrialAmount",
				header: () => <span>Free Trial Amount</span>,
			},
			{
				accessorKey: "grossRevenue",
				id: "grossRevenue",
				header: () => <span>Gross Revenue</span>,
			},
			{
				accessorKey: "sfAccountName",
				id: "sfAccountName",
				header: () => <span>SF Account Name</span>,
			},
			{
				accessorKey: "sfId",
				id: "sfId",
				header: () => <span>SF ID</span>,
			},
			{
				accessorKey: "sumOfGlances",
				id: "sumOfGlances",
				header: () => <span>Sum of Glances</span>,
			},
			{
				accessorKey: "discountValue",
				id: "discountValue",
				header: () => <span>Discount Value</span>,
			},
			{
				accessorKey: "salesPrice",
				id: "salesPrice",
				header: () => <span>Sales Price</span>,
			},
			{
				accessorKey: "ioBudgetAvailable",
				id: "ioBudgetAvailable",
				header: () => <span>IO Budget Available</span>,
			},
			{
				accessorKey: "opportunitySegment",
				id: "opportunitySegment",
				header: () => <span>Opportunity Segment</span>,
			},
			{
				accessorKey: "syncStatus",
				id: "syncStatus",
				header: () => <span>Sync Status</span>,
			},
			{
				accessorKey: "discountType",
				id: "discountType",
				header: () => <span>Discount Type</span>,
			},
			{
				accessorKey: "discountStatus",
				id: "discountStatus",
				header: () => <span>Discount Status</span>,
			},
			{
				accessorKey: "sfAccountId",
				id: "sfAccountId",
				header: () => <span>SF Account ID</span>,
			},
			{
				accessorKey: "productName",
				id: "productName",
				header: () => <span>Product Name</span>,
			},
			{
				accessorKey: "pricingModel",
				id: "pricingModel",
				header: () => <span>Pricing Model</span>,
			},
			{
				accessorKey: "salesPriceCurrency",
				id: "salesPriceCurrency",
				header: () => <span>Sales Price Currency</span>,
			},
			{
				accessorKey: "revopsTeam",
				id: "revopsTeam",
				header: () => <span>Revops Team</span>,
			},
		],
		[]
	);

	//react-query has a useInfiniteQuery hook that is perfect for this use case
	const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<ReportAPIResponse>({
		queryKey: ["report", sorting], //refetch when sorting changes
		queryFn: async ({ pageParam = 0 }) => {
			const start = (pageParam as number) * fetchSize;
			const fetchedData = await fetchData(start, fetchSize, sorting); //pretend api call
			return fetchedData;
		},
		initialPageParam: 0,
		getNextPageParam: (_lastGroup, groups) => groups.length,
		refetchOnWindowFocus: false,
		placeholderData: keepPreviousData,
	});

	//flatten the array of arrays from the useInfiniteQuery hook
	const flatData = React.useMemo(() => data?.pages?.flatMap((page) => page.data) ?? [], [data]);
	const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
	const totalFetched = flatData.length;

	//called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
	const fetchMoreOnBottomReached = React.useCallback(
		(containerRefElement?: HTMLDivElement | null) => {
			if (containerRefElement) {
				const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
				//once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
				if (scrollHeight - scrollTop - clientHeight < 500 && !isFetching && totalFetched < totalDBRowCount) {
					fetchNextPage();
				}
			}
		},
		[fetchNextPage, isFetching, totalFetched, totalDBRowCount]
	);

	//a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
	React.useEffect(() => {
		fetchMoreOnBottomReached(tableContainerRef.current);
	}, [fetchMoreOnBottomReached]);

	const table = useReactTable({
		data: flatData,
		columns,
		state: {
			sorting,
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualSorting: true,
		debugTable: true,
	});

	//scroll to top of table when sorting changes
	const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
		setSorting(updater);
		if (!!table.getRowModel().rows.length) {
			rowVirtualizer.scrollToIndex?.(0);
		}
	};

	//since this table option is derived from table row model state, we're using the table.setOptions utility
	table.setOptions((prev) => ({
		...prev,
		onSortingChange: handleSortingChange,
	}));

	const { rows } = table.getRowModel();

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
		getScrollElement: () => tableContainerRef.current,
		//measure dynamic row height, except in firefox because it measures table border height incorrectly
		measureElement:
			typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
				? (element) => element?.getBoundingClientRect().height
				: undefined,
		overscan: 5,
	});

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<div className="app">
			({flatData.length} of {totalDBRowCount} rows fetched)
			<div
				className="container"
				onScroll={(e) => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
				ref={tableContainerRef}
				style={{
					overflow: "auto", //scrollable table container
					position: "relative", //needed for sticky header
					height: "600px", //should be a fixed height
				}}
			>
				<table style={{ display: "grid" }}>
					<thead
						style={{
							display: "grid",
							position: "sticky",
							top: 0,
							zIndex: 1,
						}}
					>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id} style={{ display: "flex", width: "100%" }}>
								{headerGroup.headers.map((header) => {
									return (
										<th
											key={header.id}
											style={{
												display: "flex",
												width: header.getSize(),
											}}
										>
											<div
												{...{
													className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(header.column.columnDef.header, header.getContext())}
												{{
													asc: " 🔼",
													desc: " 🔽",
												}[header.column.getIsSorted() as string] ?? null}
											</div>
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody
						style={{
							display: "grid",
							height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
							position: "relative", //needed for absolute positioning of rows
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const row = rows[virtualRow.index] as Row<Report>;
							return (
								<tr
									data-index={virtualRow.index} //needed for dynamic row height measurement
									ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
									key={row.id}
									style={{
										display: "flex",
										position: "absolute",
										transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
										width: "100%",
									}}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<td
												key={cell.id}
												style={{
													display: "flex",
													width: cell.column.getSize(),
												}}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			{isFetching && <div>Fetching More...</div>}
		</div>
	);
}

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MockTable />
		</QueryClientProvider>
	);
}
