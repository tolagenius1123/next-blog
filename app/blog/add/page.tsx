"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

const postBlog = async ({
	title,
	description,
}: {
	title: string | undefined;
	description: string | undefined;
}) => {
	const res = await fetch("http://localhost:3000/api/blog", {
		method: "POST",
		body: JSON.stringify({ title, description }),
		//@ts-ignore
		"Content-Type": "application/json",
	});
	return await res.json();
};

const AddBlog = () => {
	const router = useRouter();

	const titleRef = useRef<HTMLInputElement | null>(null);
	const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload = {
			title: titleRef.current?.value,
			description: descriptionRef.current?.value,
		};
		// console.log(payload);

		if (payload.title && payload.description) {
			toast.loading("Sending Request", { id: "1" });
			await postBlog(payload);
			toast.success("Blog added successfully", { id: "1" });
			setTimeout(() => {
				router.push("/");
			}, 2000);
		} else {
			toast.error("All fields are required!");
		}
	};

	return (
		<Fragment>
			<Toaster />
			<div className="w-full m-auto flex my-4 ">
				<div className="flex flex-col justify-center items-center m-auto">
					<p className="text-2xl text-slate-200 font-bold p-3">
						Add Your Blog🚀
					</p>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							className="rounded-md w-full px-4 py-2 my-2 "
							placeholder="Enter Title"
							ref={titleRef}
						/>
						<textarea
							className="rounded-md px-4 py-2 w-full my-2"
							placeholder="Enter description"
							ref={descriptionRef}
						></textarea>
						<button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100 cursor-pointer">
							Submit
						</button>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default AddBlog;
