"use client";

import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import { makeData } from "../mockData";

const columns: TableProps<Report>["columns"] = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		width: "20ch",
	},
	{
		title: "Date",
		dataIndex: "date",
		width: "20ch",
		key: "date",
	},
	{
		title: "Inter Company",
		dataIndex: "interCompany",
		width: "20ch",
		key: "interCompany",
	},
	{
		title: "Billing Country",
		dataIndex: "billingCountry",
		key: "billingCountry",
		width: "20ch",
	},
	{
		title: "Revenue Reported Country",
		dataIndex: "revenueReportedCountry",
		width: "20ch",
		key: "revenueReportedCountry",
	},
	{
		title: "Channel",
		dataIndex: "channel",
		width: "20ch",
		key: "channel",
	},
	{
		title: "Supply",
		dataIndex: "supply",
		width: "20ch",
		key: "supply",
	},
	{
		title: "Brand",
		dataIndex: "brand",
		width: "20ch",
		key: "brand",
	},
	{
		title: "oemMapping",
		dataIndex: "oemMapping",
		width: "20ch",
		key: "oemMapping",
	},
	{
		title: "demand",
		dataIndex: "demand",
		width: "20ch",
		key: "demand",
	},
	{
		title: "ioNumber",
		dataIndex: "ioNumber",
		width: "20ch",
		key: "ioNumber",
	},
	{
		title: "cioNumber",
		dataIndex: "cioNumber",
		width: "20ch",
		key: "cioNumber",
	},
	{
		title: "glanceChildImageNumber",
		dataIndex: "glanceChildImageNumber",
		width: "20ch",
		key: "glanceChildImageNumber",
	},
	{
		title: "glft",
		dataIndex: "glft",
		width: "20ch",
		key: "glft",
	},
	{
		title: "billableRevenue",
		dataIndex: "billableRevenue",
		width: "20ch",
		key: "billableRevenue",
	},
	{
		title: "freeTrialAmount",
		dataIndex: "freeTrialAmount",
		width: "20ch",
		key: "freeTrialAmount",
	},
	{
		title: "grossRevenue",
		dataIndex: "grossRevenue",
		width: "20ch",
		key: "grossRevenue",
	},
	{
		title: "sfAccountName",
		dataIndex: "sfAccountName",
		width: "20ch",
		key: "sfAccountName",
	},
	{
		title: "sfId",
		dataIndex: "sfId",
		width: "20ch",
		key: "sfId",
	},
	{
		title: "sumOfGlances",
		dataIndex: "sumOfGlances",
		width: "20ch",
		key: "sumOfGlances",
	},
	{
		title: "freeTrialAmount",
		dataIndex: "freeTrialAmount",
		width: "20ch",
		key: "freeTrialAmount",
	},
];

export default function AntdTable() {
	return <Table virtual columns={columns} dataSource={makeData(10000)} />;
}
