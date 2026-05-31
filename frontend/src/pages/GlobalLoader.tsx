import StockLoader from "@/components/ui/StockLoader"

const GlobalLoader = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <StockLoader />
        </div>
    )
}

export default GlobalLoader