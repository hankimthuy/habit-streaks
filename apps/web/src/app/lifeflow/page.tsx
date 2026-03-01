import MaterialIcon from "@/components/icons/MaterialIcon";
import BottomNav from "@/components/layout/BottomNav";

export default function LifeFlowPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center pb-20">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <MaterialIcon name="waves" className="text-4xl text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-3">LifeFlow</h1>
            <p className="text-slate-400 text-lg max-w-sm">
                We're working on something exciting! LifeFlow is coming soon to help you track your life's rhythms.
            </p>
            <BottomNav />
        </div>
    );
}
