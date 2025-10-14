import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';



const CallToAction = () => {
  const navigate = useNavigate();

 return (

    <section className="py-20 sm:py-32">

      <div className="mx-auto max-w-screen-xl px-4 text-center">

        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-teal-500 p-12">

          <h2 className="text-4xl font-bold">Ready to Unlock Premium Features?</h2>

          <p className="mt-4 text-lg text-white/90 mb-8">
            Get unlimited AI suggestions, access all templates, and more with our Pro plans.
          </p>

          <Button size="lg" variant="outline" className="mt-8 rounded-full bg-transparent px-8 py-6 text-lg hover:bg-white hover:text-black" onClick={() => navigate('/#pricing')}>

            View Pricing Plans

          </Button>

        </div>

      </div>

    </section>

  );

};



export default CallToAction;