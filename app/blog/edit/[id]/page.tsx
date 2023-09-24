"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";

interface UpdateBlogParams {
	id: string | undefined;
	title: string | undefined;
	description: string | undefined;
}

const updateBlog = async ({ id, title, description }: UpdateBlogParams) => {
	const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
		method: "PUT",
		body: JSON.stringify({
			title: title,
			description: description,
		}),
		//@ts-ignore
		"Content-Type": "application/json",
	});
	return await res.json();
};

const getBlogById = async (id: string) => {
	const res = await fetch(`http://localhost:3000/api/blog/${id}`);
	const data = await res.json();
	return data.post;
};

const deleteBlog = async (id: string) => {
	const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
		method: "DELETE",
		//@ts-ignore
		"Content-Type": "application/json",
	});
	return await res.json();
};

const EditBlog = ({ params }: { params: { id: string } }) => {
	const router = useRouter();

	const titleRef = useRef<HTMLInputElement | null>(null);
	const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		toast.loading("fetching blog details", { id: "1" });
		getBlogById(params.id)
			.then((data) => {
				console.log(data);

				if (titleRef.current && descriptionRef.current) {
					titleRef.current.value = data.title;
					descriptionRef.current.value = data.description;
					toast.success("fetching complete", { id: "1" });
				}
			})
			.catch((err) => {
				console.log(err);
				toast.error("Error fetching blog", { id: "1" });
			});
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (titleRef.current && descriptionRef.current) {
			toast.loading("Sending Request", { id: "1" });
			await updateBlog({
				title: titleRef.current?.value,
				description: descriptionRef.current?.value,
				id: params.id,
			});
			toast.success("Blog updated successfully", { id: "1" });
			setTimeout(() => {
				router.push("/");
			}, 2000);
		} else {
			toast.error("All fields are required!");
		}
	};

	const handleDelete = async () => {
		toast.loading("Deleting blog", { id: "2" });
		await deleteBlog(params.id);
		toast.success("Blog deleted successfully", { id: "2" });
		setTimeout(() => {
			router.push("/");
		}, 2000);
	};

	return (
		<Fragment>
			<Toaster />
			<div className="w-full m-auto flex my-4 ">
				<div className="flex flex-col justify-center items-center m-auto">
					<p className="text-2xl text-slate-200 font-bold p-3">
						Edit Your Blog🚀
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
						<div className="flex w-1/2 items-center justify-between">
							<button
								type="submit"
								className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100 cursor-pointer"
							>
								Update
							</button>
							<button
								type="button"
								className="font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-red-500 cursor-pointer"
								onClick={() => handleDelete()}
							>
								Delete
							</button>
						</div>
					</form>
				</div>
			</div>
		</Fragment>
	);
};

export default EditBlog;
