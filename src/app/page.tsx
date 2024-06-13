import { Flex } from "antd";
import Link from "next/link";

export default function App() {
	return (
		<Flex vertical gap="large" align="middle" justify="center">
			<Link href="/tanstack">Tanstack Virtual Table</Link>
			<Link href="/antd">ANTD Table</Link>
		</Flex>
	);
}
