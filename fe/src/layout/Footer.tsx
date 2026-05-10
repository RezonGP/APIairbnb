function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
                © {new Date().getFullYear()} APIairbnb
            </div>
        </footer>
    )
}

export default Footer