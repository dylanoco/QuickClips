
import '../styles/NavBar.css';


/* shadcn imports nav bar */
import {
  NavigationMenu,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export function NavBar() {
    return (
        <NavigationMenu className="flex absolute top-0 left-0 w-full z-50 justify-between items-center p-12 "
        style={{ maxWidth: "100vw" }}>
            {/* <p className='text-xl font-bold text-white text-shadow-md border rounded-3xl border-white bg-blue-400 p-2 tracking-wide'>QuickClips</p> */}
            <div className='absolute left-1/2 transform -translate-x-1/2'>
                <NavigationMenuList className='w-full flex justify-center gap-8'>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="nav-link" href="/">Features</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink className="nav-link" href="/about">Why QuickClips</NavigationMenuLink>
                        </NavigationMenuItem>
                </NavigationMenuList>
            </div>
            <NavigationMenuIndicator />
            <NavigationMenuViewport />
        </NavigationMenu>
     );
}